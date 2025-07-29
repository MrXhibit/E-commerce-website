import { Schema, Document, model } from "mongoose";
import { productProperties } from "@/domain/entities";

type ProductWithoutCategory = Omit<productProperties, 'category'>;

type productDb = ProductWithoutCategory & {
    category : Schema.Types.ObjectId
}

export type IProduct = productDb & Document;

const productSchema: Schema<IProduct> = new Schema(
  {
   name: {
      type: String,
      required: true,
      trim: true,
    },
   images:[
    {
     url : {
        type :String,
        required : true
     },
     id : {
        type : String,
        required : true
     }
    }
   ],
   description :{
    type : String,
    required : true
   },
   price :{
    type : String,
    required : true
   },
   category : {
    type : Schema.Types.ObjectId,
    ref : 'Category'
   },
   brandName: {
    type : String,
    required : true
   },
    isListed : {
     type : Boolean,
     required : true
    },
    stock : {
     type : Number,
     required : true
    },
    modelName : {
      type : String,
      required : true
    } 
  },
  {
    timestamps: true,
  },
);

const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
