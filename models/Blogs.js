const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    blog_title: {
      type: String,
      required: true,
    },
    blog_desc: {
      type: String,
      required: true,
    },
    blog_author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "admins",
    },
    blog_content: {
      type: String,
      required: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "published",
    },
    comments: [
      {
        text: {
          type: String,
        },
        userId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "clients",
        },
      },
    ],
    blog_images: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("blogs", blogSchema);
