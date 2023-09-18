const mongoose = require("mongoose");

var todoSchema = mongoose.Schema({
  title: {
    type: String,
    minLength: [3, "title is less than 3 characters"],
    maxLength: 25,
    required: true,
    // unique:true,
    trim: true,
    // validate: {
    //     validator: function(v) {
    //       return /\d{3}-\d{3}-\d{4}/.test(v);
    //     },
    //     message: props => `${props.value} is not a valid title!`
    //   },
    //   default:"any title"
  },
  status: {
    type: String,
    enum: ["Todo", "In progress", "Done"],
    default: "Todo",
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
});

var todosModel = mongoose.model("Todo", todoSchema);

module.exports = todosModel;
