// API service functions
const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const apiService = {
  // AI Analysis Service
  analyzeText: async (text) => {
    try {
      // TODO: Replace with actual API call
      // Simulating AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      return {
        success: true,
        data: {
          sentiment: {
            score: Math.random() * 100,
            label: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
          },
          emotions: {
            joy: Math.random() * 100,
            sadness: Math.random() * 100,
            anger: Math.random() * 100,
            fear: Math.random() * 100,
            anxiety: Math.random() * 100,
          },
          advice: [
            'Take time for self-care and relaxation',
            'Consider talking to a mental health professional',
            'Practice mindfulness and meditation',
            'Maintain a regular sleep schedule',
          ],
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Depression Meter Service
  submitDepressionTest: async (answers) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
      const maxScore = Object.keys(answers).length * 4;
      const percentage = (score / maxScore) * 100;
      
      let severity = 'Minimal';
      let color = '#10b981';
      if (percentage > 75) {
        severity = 'Severe';
        color = '#ef4444';
      } else if (percentage > 50) {
        severity = 'Moderate';
        color = '#f59e0b';
      } else if (percentage > 25) {
        severity = 'Mild';
        color = '#3b82f6';
      }
      
      return {
        success: true,
        data: {
          score,
          percentage,
          severity,
          color,
          recommendations: [
            severity === 'Severe' ? 'Please consult a mental health professional immediately' : 'Continue monitoring your mental health',
            'Practice regular exercise and maintain a healthy diet',
            'Stay connected with friends and family',
          ],
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Unarathma Service
  submitUnarathmaRequest: async (data) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      return {
        success: true,
        data: {
          reportId: 'RPT' + Date.now(),
          aiReport: {
            analysis: 'Based on your inputs, our AI has identified potential areas of concern...',
            recommendations: [
              'Regular counseling sessions',
              'Stress management techniques',
              'Lifestyle modifications',
            ],
          },
          doctorRequired: Math.random() > 0.5,
          estimatedTime: '2-3 business days',
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Contact Doctor
  contactDoctor: async (reportId, message) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Your request has been sent. A doctor will contact you within 24 hours.',
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Book Session
  bookSession: async (sessionData) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return {
        success: true,
        bookingId: 'BKG' + Date.now(),
        message: 'Session booked successfully!',
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get activity hub content
  getActivityContent: async (type) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockContent = {
        music: [
          { id: '1', title: 'Relaxing Piano', duration: '15:00', url: '#' },
          { id: '2', title: 'Nature Sounds', duration: '20:00', url: '#' },
          { id: '3', title: 'Meditation Music', duration: '30:00', url: '#' },
        ],
        videos: [
          { id: '1', title: 'Breathing Exercises', duration: '10:00', thumbnail: '', url: '#' },
          { id: '2', title: 'Yoga for Stress Relief', duration: '25:00', thumbnail: '', url: '#' },
          { id: '3', title: 'Mindfulness Practice', duration: '15:00', thumbnail: '', url: '#' },
        ],
        games: [
          { id: '1', title: 'Memory Match', description: 'Improve focus and memory', icon: '🎮' },
          { id: '2', title: 'Breathing Game', description: 'Practice breathing techniques', icon: '🌬️' },
          { id: '3', title: 'Mood Tracker', description: 'Track your daily mood', icon: '😊' },
        ],
        books: [
          { id: '1', title: 'The Mindful Way', author: 'John Kabat-Zinn', pages: 250 },
          { id: '2', title: 'Feeling Good', author: 'David Burns', pages: 350 },
          { id: '3', title: 'The Happiness Trap', author: 'Russ Harris', pages: 200 },
        ],
        blogs: [
          { id: '1', title: 'Understanding Anxiety', date: '2024-01-15', excerpt: 'Learn about anxiety and how to manage it...' },
          { id: '2', title: '5 Ways to Improve Mental Health', date: '2024-01-10', excerpt: 'Simple daily practices for better mental health...' },
          { id: '3', title: 'The Power of Meditation', date: '2024-01-05', excerpt: 'Discover how meditation can transform your life...' },
        ],
      };
      
      return {
        success: true,
        data: mockContent[type] || [],
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
