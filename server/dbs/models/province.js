import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ProvinceSchema = new Schema({
  id: {
    type: String,
    require: true
  },
  value: {
    type: Array,
    require: true
  }
})

export default mongoose.model('Province', ProvinceSchema)
