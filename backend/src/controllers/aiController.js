const openai = require('../services/openai');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get AI suggestions for a task
// @route   POST /api/ai/suggestions
// @access  Private
exports.getTaskSuggestions = catchAsync(async (req, res, next) => {
  const { title, description, category, requiredSkills } = req.body;
  
  if (!title || !description) {
    return next(new AppError('Title and description are required', 400));
  }
  
  const prompt = `
    Task Title: ${title}
    Task Description: ${description}
    ${category ? `Category: ${category}` : ''}
    ${requiredSkills ? `Required Skills: ${requiredSkills.join(', ')}` : ''}
    
    Please provide 3 helpful suggestions or recommendations for completing this task effectively.
  `;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
      temperature: 0.7,
      n: 1
    });
    
    const text = response.data.choices[0].text.trim();
    
    // Split text into individual suggestions
    const suggestions = text
      .split(/\d+\.\s+/) // Split by numbered lists: "1. ", "2. ", etc.
      .filter(Boolean)   // Remove empty strings
      .map(s => s.trim()); // Trim whitespace
    
    res.status(200).json({
      status: 'success',
      data: {
        suggestions
      }
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return next(new AppError('Failed to generate AI suggestions. Please try again later.', 500));
  }
});

// @desc    Generate AI contribution for a task
// @route   POST /api/ai/contribute/:taskId
// @access  Private
exports.contributeToTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is allowed to request AI assistance
  if (task.creator.toString() !== req.user.id.toString() && 
      (!task.assignedTo || task.assignedTo.toString() !== req.user.id.toString())) {
    return next(new AppError('You are not authorized to request AI contributions for this task', 403));
  }
  
  const { query } = req.body;
  
  if (!query) {
    return next(new AppError('Query is required', 400));
  }
  
  // Generate context from task details
  const context = `
    Task Title: ${task.title}
    Task Description: ${task.description}
    Category: ${task.category}
    Required Skills: ${task.requiredSkills.join(', ')}
    
    User Query: ${query}
  `;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: context,
      max_tokens: 500,
      temperature: 0.7,
      n: 1
    });
    
    const suggestion = response.data.choices[0].text.trim();
    
    // Save the AI contribution to the task
    task.aiContributions.push({
      suggestion,
      category: 'recommendation'
    });
    
    await task.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        contribution: {
          suggestion,
          category: 'recommendation'
        }
      }
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return next(new AppError('Failed to generate AI contribution. Please try again later.', 500));
  }
});

// @desc    Get skill recommendations based on profile
// @route   GET /api/ai/skill-recommendations
// @access  Private
exports.getSkillRecommendations = catchAsync(async (req, res, next) => {
  // Get user skills
  const userSkills = req.user.skills.map(skill => skill.name);
  
  if (userSkills.length === 0) {
    return next(new AppError('You need to add some skills to your profile first', 400));
  }
  
  const prompt = `
    Based on a user with the following skills:
    ${userSkills.join(', ')}
    
    Suggest 5 additional complementary skills that would be beneficial to learn next.
    For each suggestion, provide a brief reason why it would be valuable.
  `;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 400,
      temperature: 0.7,
      n: 1
    });
    
    const text = response.data.choices[0].text.trim();
    
    // Parse the response into structured recommendations
    const recommendations = [];
    const lines = text.split('\n').filter(Boolean);
    
    let currentSkill = null;
    let currentReason = null;
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s+/)) {
        // If we already have a skill, add it to recommendations before starting new one
        if (currentSkill) {
          recommendations.push({
            skill: currentSkill,
            reason: currentReason
          });
        }
        
        // Extract the skill name, removing the number
        currentSkill = line.replace(/^\d+\.\s+/, '').trim();
        currentReason = null;
      } else if (currentSkill) {
        // This is the explanation for the current skill
        currentReason = line.trim();
      }
    }
    
    // Add the last skill if there is one
    if (currentSkill && !recommendations.find(r => r.skill === currentSkill)) {
      recommendations.push({
        skill: currentSkill,
        reason: currentReason
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        recommendations
      }
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return next(new AppError('Failed to generate skill recommendations. Please try again later.', 500));
  }
}); 