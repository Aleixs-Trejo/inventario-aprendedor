const {Schema} = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new Schema(
  {
    trabajadorUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    usuario: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    eliminadoUsuario: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.methods.encryptPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
}

userSchema.methods.matchPassword = async function(password){
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
}

module.exports = userSchema;