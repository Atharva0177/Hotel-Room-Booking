const { prisma } = require('../config/db');

const getAbout = async (req, res, next) => {
  try {
    let about = await prisma.about.findFirst();
    
    if (!about) {
      // Seed default About content
      about = await prisma.about.create({
        data: {
          heritageTagline: 'Our Heritage',
          heritageTitle: 'About Aurelia Grand',
          heritageDescription: 'A design-forward sanctuary where warm service, elevated interiors, and curated local culture come together.',
          storyTitle: 'Our Story',
          storyContent: 'Founded in 1998, Aurelia Grand Hotel blends modern hospitality with timeless editorial elegance. With over two decades of experience, we have perfected the art of creating memorable experiences for discerning travelers seeking authentic luxury and refined comfort.',
          awardsTitle: 'Awards & Certifications',
          awards: JSON.stringify([
            { title: 'Global Five Star Hospitality Award 2025', icon: '⭐' },
            { title: 'Luxury Wellness Destination of the Year', icon: '🌟' },
            { title: 'Sustainable Excellence Gold Certification', icon: '🏆' },
            { title: 'Best Boutique Hotel in South Asia 2024', icon: '✓' }
          ])
        }
      });
    }
    
    return res.json({
      ...about,
      awards: JSON.parse(about.awards || '[]')
    });
  } catch (error) {
    return next(error);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const { heritageTagline, heritageTitle, heritageDescription, storyTitle, storyContent, awardsTitle, awards } = req.body;
    
    let about = await prisma.about.findFirst();
    
    if (!about) {
      about = await prisma.about.create({
        data: {
          heritageTagline,
          heritageTitle,
          heritageDescription,
          storyTitle,
          storyContent,
          awardsTitle,
          awards: JSON.stringify(awards)
        }
      });
    } else {
      about = await prisma.about.update({
        where: { id: about.id },
        data: {
          heritageTagline,
          heritageTitle,
          heritageDescription,
          storyTitle,
          storyContent,
          awardsTitle,
          awards: JSON.stringify(awards)
        }
      });
    }
    
    return res.json({
      ...about,
      awards: JSON.parse(about.awards || '[]')
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAbout, updateAbout };
