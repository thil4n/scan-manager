package queue

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"
	"github.com/rs/zerolog"
	"github.com/scan-manager/backend/internal/domain"
)

const (
	// TypeScanJob is the task type for scan processing.
	TypeScanJob = "scan:execute"

	// QueueCritical is the high priority queue.
	QueueCritical = "critical"
	// QueueDefault is the default priority queue.
	QueueDefault = "default"
)

// ScanJobPayload is the data sent to scan workers.
type ScanJobPayload struct {
	ScanID    uuid.UUID       `json:"scanId"`
	ReleaseID uuid.UUID       `json:"releaseId"`
	ScanType  domain.ScanType `json:"scanType"`
}

// Client wraps asynq.Client for enqueueing tasks.
type Client struct {
	client *asynq.Client
	logger zerolog.Logger
}

// NewClient creates a new queue client connected to Redis.
func NewClient(redisAddr, redisPassword string, redisDB int, logger zerolog.Logger) *Client {
	client := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       redisDB,
	})

	return &Client{
		client: client,
		logger: logger,
	}
}

// Close shuts down the queue client.
func (c *Client) Close() error {
	return c.client.Close()
}

// EnqueueScanJob enqueues a scan execution task.
func (c *Client) EnqueueScanJob(ctx context.Context, scanID uuid.UUID, releaseID uuid.UUID, scanType domain.ScanType) error {
	payload := ScanJobPayload{
		ScanID:    scanID,
		ReleaseID: releaseID,
		ScanType:  scanType,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal scan job payload: %w", err)
	}

	task := asynq.NewTask(TypeScanJob, data,
		asynq.Queue(QueueDefault),
		asynq.MaxRetry(3),
	)

	info, err := c.client.EnqueueContext(ctx, task)
	if err != nil {
		return fmt.Errorf("enqueue scan job: %w", err)
	}

	c.logger.Info().
		Str("task_id", info.ID).
		Str("scan_id", scanID.String()).
		Str("type", string(scanType)).
		Str("queue", info.Queue).
		Msg("scan job enqueued")

	return nil
}
