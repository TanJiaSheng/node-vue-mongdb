const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  title: { type: String },
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}],
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
    tips: { type: String }
  }],
  items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'item' }],
  items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'item' }],
  usageTips: { type: String },
  battleTips: { type: String },
  teamTips: { type: String },
  partners: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
    desc: { type: String }
  }]
})

module.exports = mongoose.model('Hero', schema)