const express = require('express')
const Checklist = require('../models/ChecklistModel')

const router = express.Router();

router.get('/', async (req, res) => {
  try{
    let listOfChecklist = await Checklist.find({}).populate('tasks')
    res.status(200).render('checklists/index', { checklist: listOfChecklist})
  } catch(err) {
    res.status(500).render('pages/error', { err: 'Unable to show the tasks'})
  }
})

router.get('/create', async (req, res) => {
  try{
    let checklist = new Checklist()
    res.status(200).render('checklists/create', { checklist: checklist})
  } catch(err) {
    res.status(500).render('pages/error', { err: 'Unable to show the tasks'})
  }
})

router.post('/', async (req, res) => {  
  try {
    let {name} = req.body.checklist
    let newChecklist = new Checklist({name})
    await newChecklist.save()
    res.redirect('/checklists')
  } catch(err) {
    res.status(422).render('checklist/new', { checklist: {...newChecklist, error}})
  }
})

router.get('/:id', async (req, res) => {
  try{
    let { id } = req.params
    let foundChecklist = await Checklist.findById(id).populate('tasks')
    res.status(200).render('checklists/show', {checklist: foundChecklist })
  } catch(err) {
    res.status(422).render('pages/error', { err: 'Unable to get specified list'})
  }
})

router.get('/edit/:id', async (req, res) => {
  try{
    let { id } = req.params
    let foundCheckList = await Checklist.findById(id)
    res.status(200).render('checklists/edit', { checklist: foundCheckList})
  } catch(err) {
    res.status(500).render('pages/error', { err: 'Unable to show the editing page'})
  }
})

router.put('/:id', async (req, res) => {
  try {
    let { name }  = req.body.checklist
    let { id }    = req.params
    let updatedChecklist = await Checklist.findByIdAndUpdate(id, {name}, {new: true})
    res.status(200).redirect('/checklists')
  } catch (err) {
    res.status(422).render('pages/error', { err: 'Unable to edit the register'})    
  }
})

router.delete('/:id', async (req, res) => {
  try {
    let { id }    = req.params
    let deletedChecklist = await Checklist.findByIdAndRemove(id)
    res.status(200).redirect('/checklists')
  } catch (err) {
    res.status(422).render('pages/error', { err: 'Unable to delete the registers'})   
  }
})

module.exports = router