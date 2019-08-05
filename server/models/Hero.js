const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  banner: { type: String },
  title: { type: String },
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}],
  inscriptions: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Inscription'}],
  scores: {
    difficult: { type: Number },
    skills: { type: Number },
    attack: { type: Number },
    survice: { type: Number }
  },
  skills: [{
    icon: { type: String },
    name: { type: String },
    desc: { type: String },
    tips: { type: String },
    delay: { type: String },
    cost: { type: String },
  }],
  items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Item' }],
  usageTips: { type: String },
  battleTips: { type: String },
  teamTips: { type: String },
  partners: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
    desc: { type: String }
  }],
  beRestrained: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
    desc: { type: String }
  }],
  restrain: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
    desc: { type: String }
  }]
})

module.exports = mongoose.model('Hero', schema, 'heroes')