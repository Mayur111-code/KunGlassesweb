import { Schema, model, models, InferSchemaType } from 'mongoose';

const activityLogSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    adminName: { type: String, default: '' },
    action: { type: String, required: true, trim: true },
    entity: { type: String, required: true, trim: true },
    entityId: { type: Schema.Types.Mixed, default: null },
    entityName: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activityLogSchema.index({ admin: 1, createdAt: -1 });
activityLogSchema.index({ entity: 1, entityId: 1 });

export interface ActivityLogDoc extends InferSchemaType<typeof activityLogSchema> {
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export const ActivityLog =
  models.ActivityLog || model('ActivityLog', activityLogSchema);