import { Schema, Document, model } from "mongoose";
import { categoryProperties } from "@/domain/entities";

type categoryWithoutParentId = Omit<categoryProperties, "parentId">;
type categoryDb = categoryWithoutParentId & {
  parentId: Schema.Types.ObjectId;
};
export type Icategory = categoryDb & Document;

const categorySchema: Schema<Icategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    parentId: Schema.Types.ObjectId,
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const CategoryModel = model<Icategory>("Category", categorySchema);

export default CategoryModel;
