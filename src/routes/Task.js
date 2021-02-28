const express = require('express')
const Checklist = require('../models/ChecklistModel')
const Task = require('../models/TaskModel')
const fosterRoute = express.Router();
const simpleRoute = express.Router();

fosterRoute.get('/:id/tasks/create', async(req, res) => {
  try {
    let newTask = new Task()
    res.status(200).render('tasks/create', { checkId: req.params.id, task: newTask })
  } catch (err) {
    res.status(422).render('pages/error', {err: err})
  }
})

fosterRoute.post('/:id/tasks', async(req, res) => {
  try {
    let { name } = req.body.task
    let createdTask = new Task({name, checklist: req.params.id})
    await createdTask.save()

    let fatherChecklist = await Checklist.findById(req.params.id)
    fatherChecklist.tasks.push(createdTask)
    await fatherChecklist.save()

    res.status(200).redirect(`/checklists/${req.params.id}`)
  } catch (err) {
    res.status(422).render('pages/error', {err: err})
  }
})

simpleRoute.delete('/:id', async(req, res) => {
  try {
    let deletedTask = await Task.findByIdAndDelete(req.params.id)
    let checklist = await Checklist.findById(deletedTask.checklist)
    let checklistTask = checklist.tasks.indexOf(deletedTask._id)
    checklist.tasks.slice(checklistTask, 1)
    checklist.save()
    res.redirect(`/checklists/${checklist._id}`)    
  } catch (err) {
    res.status(422).render('pages/error', {err: err})    
  }
})

simpleRoute.put('/:id', async(req, res) => {
  try {
    let selectedTask = await Task.findById(req.params.id)
    selectedTask.set(req.body.task)
    await selectedTask.save()
    res.status(200).json({ selectedTask })
  } catch (err) {
    console.log(err)
    //res.status(422).json({ task: {...err} })
  }
})


module.exports = { fosterRoute: fosterRoute,
                   simpleRoute: simpleRoute }