const {Schema, model} = require("mongoose");
const CounterSale = require("./counterSaleModel");

const saleSchema = new Schema(
  {
    ventaID: {
      type: String
    },
    usuarioVenta:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    estadoVenta: {
      type: String,
      required: true
    },
    clienteVenta: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    productosVenta: [{
      productoVenta: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
      },
      cantidadVenta: {
        type: Number,
        required: true
      },
      descuentoProductoVenta: {
        type: Number,
        required: true
      },
      costoTotalProducto: {
        type: Number,
        default: 0
      },
      precioTotalProducto: {
        type: Number,
        required: true
      },
      gananciaTotalProducto: {
        type: Number,
        required: true
      }
    }],
    tipoProductosVenta: {
      type: Number,
      required: true
    },
    costoTotalVenta: {
      type: Number,
      default: 0
    },
    precioTotalVenta: {
      type: Number,
      required: true
    },
    descuentoTotalVenta: {
      type: Number,
      default: 0,
    },
    gananciaTotalVenta: {
      type: Number,
      required: true
    },
    ventaCerrada: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

saleSchema.pre("save", async function(next) {
  if (this.isNew) {
    // Verificar si existen ventas
    const existingSales = await model("Sale").countDocuments();

    if (existingSales === 0) {
      // Reiniciar el contador de ventas
      await CounterSale.updateOne(
        {id: "ventas"},
        { $set: {prefix: 0, seq: 0} },
        { upsert: true }
      );
    }

    // Obtener el contador actualizado
    let counter = await CounterSale.findOne({id: "ventas"});

    if (!counter) {
      // Crear un nuevo contador de ventas
      counter = await CounterSale.create({id: "ventas", prefix: 0, seq: 0});
    }

    counter.seq += 1;
    
    if (counter.seq > 9999) {
      counter.prefix += 1;
      counter.seq = 0;
    }
    await counter.save();

    let prefixStr = counter.prefix.toString().padStart(3, "0");
    let seqNumber = counter.seq.toString().padStart(4, "0");
    
    this.ventaID = `B${prefixStr}-${seqNumber}`;
  }
  next();
});

module.exports = saleSchema;
