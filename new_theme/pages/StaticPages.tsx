
import React from 'react';
import { BlogPost } from '../types';
import { 
  Archive, Folder, Tag, Heart, Coffee, Globe, User, BookOpen, 
  MapPin, Briefcase, GraduationCap, Terminal, Code, Cpu, Layout, 
  Mail, Github, Linkedin, Twitter, Star, Smile
} from 'lucide-react';
import { motion } from 'framer-motion';

interface StaticPageProps {
  posts?: BlogPost[];
  onReadPost?: (post: BlogPost) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

// --- Archives Page ---
export const ArchivesPage: React.FC<StaticPageProps> = ({ posts = [], onReadPost }) => {
  // Group posts by year
  const groupedPosts = posts.reduce((acc, post) => {
    const year = post.date.split('-')[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-16">
        <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", stiffness: 260, damping: 20 }}
           className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface border border-slate-200 dark:border-slate-700 text-primary mb-6 shadow-sm"
        >
          <Archive size={32} />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">归档</h1>
        <p className="text-gray-500 dark:text-slate-400">Viewing all {posts.length} articles</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {years.map(year => (
          <motion.div key={year} variants={itemVariants} className="relative pl-8 border-l border-slate-300 dark:border-slate-700">
             <span className="absolute -left-4 top-0 bg-background px-2 text-2xl font-bold text-gray-400 dark:text-slate-500">{year}</span>
             <div className="mt-8 space-y-6">
                {groupedPosts[year].map(post => (
                   <div 
                      key={post.id} 
                      onClick={() => onReadPost && onReadPost(post)}
                      className="group flex items-baseline cursor-pointer"
                   >
                      <span className="text-sm font-mono text-gray-400 dark:text-slate-500 w-24 flex-shrink-0">{post.date.substring(5)}</span>
                      <span className="text-lg text-gray-700 dark:text-slate-300 group-hover:text-primary transition-colors">{post.title}</span>
                   </div>
                ))}
             </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// --- Categories Page ---
export const CategoriesPage: React.FC<StaticPageProps> = ({ posts = [] }) => {
  const categories = Array.from(new Set(posts.flatMap(p => p.categories || [])));
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
       <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center mb-16"
       >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">分类</h1>
        <p className="text-gray-500 dark:text-slate-400 max-w-lg mx-auto">Explore articles by topic. Currently tracking {categories.length} unique categories.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
         {categories.map(cat => (
           <motion.div 
             key={cat} 
             variants={itemVariants}
             whileHover={{ scale: 1.05, y: -5 }}
             whileTap={{ scale: 0.95 }}
             className="group bg-surface border border-slate-200 dark:border-slate-800 hover:border-primary/50 p-6 rounded-2xl text-center transition-colors cursor-pointer shadow-sm hover:shadow-lg"
           >
              <Folder size={32} className="mx-auto mb-4 text-primary transition-transform" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{cat}</h3>
              <span className="text-sm text-gray-500 dark:text-slate-500">{posts.filter(p => p.categories?.includes(cat)).length} articles</span>
           </motion.div>
         ))}
      </motion.div>
    </div>
  );
};

// --- Tags Page ---
export const TagsPage: React.FC<StaticPageProps> = ({ posts = [] }) => {
  const tags = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="text-center mb-16"
       >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">标签</h1>
      </motion.div>

      <motion.div 
        className="flex flex-wrap justify-center gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
         {tags.map(tag => (
           <motion.span 
             key={tag} 
             variants={itemVariants}
             whileHover={{ scale: 1.1, rotate: -2 }}
             whileTap={{ scale: 0.9 }}
             className="px-6 py-3 bg-surface hover:bg-primary/10 border border-slate-200 dark:border-slate-700 hover:border-primary/50 rounded-full text-gray-600 dark:text-slate-300 hover:text-primary cursor-pointer text-lg shadow-sm transition-colors"
           >
              #{tag}
           </motion.span>
         ))}
      </motion.div>
    </div>
  );
};

// --- About Page (Comprehensive) ---
export const AboutPage: React.FC = () => {
    
  const SKILLS = [
    { category: "Frontend", icon: <Layout size={18} />, items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"] },
    { category: "Backend", icon: <Terminal size={18} />, items: ["Node.js", "Go (Hugo)", "Python", "PostgreSQL"] },
    { category: "Design", icon: <Cpu size={18} />, items: ["Figma", "Minimalism", "UI/UX", "Accessibility"] },
    { category: "Tools", icon: <Code size={18} />, items: ["Git", "VS Code", "Docker", "Gemini AI"] },
  ];

  const EXPERIENCES = [
    { year: "2023 - Present", role: "Senior Frontend Engineer", company: "Tech Innovators Inc.", desc: "Leading the frontend architecture and design system." },
    { year: "2021 - 2023", role: "Full Stack Developer", company: "Creative Solutions", desc: "Built scalable web applications and internal tools." },
    { year: "2019 - 2021", role: "Junior Developer", company: "StartUp Garage", desc: "Learned the ropes of modern web development." },
  ];

  const VALUES = [
    { title: "Clean Code", icon: <Star size={24} />, desc: "Writing code that is readable by humans, not just machines." },
    { title: "User First", icon: <Heart size={24} />, desc: "Designing interfaces that delight and solve real problems." },
    { title: "Always Learning", icon: <BookOpen size={24} />, desc: "Technology never stops, and neither do I." },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto px-6 py-12"
    >
        {/* Header Profile Section */}
        <motion.div variants={itemVariants} className="bg-surface border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 mb-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-purple-500/20"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-12">
                <div className="w-32 h-32 rounded-full border-4 border-surface bg-white dark:bg-slate-700 flex items-center justify-center shadow-lg text-primary overflow-hidden">
                    <User size={64} />
                    {/* Ideally an <img src="..." /> here */}
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dev One</h1>
                    <p className="text-lg text-primary font-medium mb-1">Creative Technologist & UI Designer</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-slate-400">
                        <span className="flex items-center"><MapPin size={14} className="mr-1"/> San Francisco, CA</span>
                        <span className="flex items-center"><Briefcase size={14} className="mr-1"/> Open for hire</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-primary transition-colors"><Github size={20}/></button>
                    <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-primary transition-colors"><Twitter size={20}/></button>
                    <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-primary transition-colors"><Linkedin size={20}/></button>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-lg max-w-3xl">
                    Hello! I'm a passionate developer who loves building beautiful, functional, and minimal web experiences. 
                    I believe that great software is a mix of engineering precision and artistic intuition. 
                    When I'm not coding, you can find me hiking, reading sci-fi, or experimenting with new coffee brews.
                </p>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Skills & Values */}
            <div className="lg:col-span-2 space-y-8">
                {/* Values Section */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Smile className="mr-2 text-primary" size={20}/> What I Value
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {VALUES.map((val, idx) => (
                            <motion.div 
                                key={idx} 
                                whileHover={{ y: -5 }}
                                className="bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center"
                            >
                                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">{val.icon}</div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{val.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Skills Matrix */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <Cpu className="mr-2 text-primary" size={20}/> Technical Arsenal
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {SKILLS.map((skillGroup) => (
                            <div key={skillGroup.category} className="bg-surface border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
                                <h3 className="flex items-center text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                    <span className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded mr-2 text-primary">{skillGroup.icon}</span>
                                    {skillGroup.category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillGroup.items.map(item => (
                                        <span key={item} className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-md">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Col: Timeline */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <GraduationCap className="mr-2 text-primary" size={20}/> Journey
                </h2>
                <div className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8 pl-8 py-2">
                        {EXPERIENCES.map((exp, idx) => (
                            <div key={idx} className="relative">
                                <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-surface bg-primary shadow-sm"></span>
                                <span className="text-xs font-mono font-bold text-primary mb-1 block">{exp.year}</span>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 italic mb-2">{exp.company}</p>
                                <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{exp.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg">
                    <Mail className="mx-auto mb-4" size={32} />
                    <h3 className="font-bold text-lg mb-2">Let's work together</h3>
                    <p className="text-sm opacity-90 mb-4">Have a project in mind? I'd love to hear about it.</p>
                    <button className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm hover:shadow-xl hover:scale-105 transition-all">
                        Get in Touch
                    </button>
                </div>
            </motion.div>
        </div>
    </motion.div>
  );
};

// --- Credits Page ---
export const CreditsPage: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-6 py-20 text-center"
    >
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block"
        >
           <Heart className="mx-auto text-red-500 mb-6" size={48} />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">鸣谢</h1>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-6 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants} className="p-6 bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center"><Coffee className="mr-2 text-yellow-500" size={20}/> Tech Stack</h3>
                <ul className="space-y-2 text-gray-600 dark:text-slate-400">
                    <li>• React 19</li>
                    <li>• Tailwind CSS</li>
                    <li>• Lucide Icons</li>
                    <li>• Vite</li>
                </ul>
            </motion.div>
             <motion.div variants={itemVariants} className="p-6 bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center"><Globe className="mr-2 text-blue-500" size={20}/> Services</h3>
                <ul className="space-y-2 text-gray-600 dark:text-slate-400">
                    <li>• Google Gemini AI</li>
                    <li>• Unsplash (Inspiration)</li>
                    <li>• Google Fonts (Inter & Fira Code)</li>
                </ul>
            </motion.div>
        </motion.div>

        <div className="mt-12 text-gray-500 dark:text-slate-500">
            Made with <span className="text-red-500">♥</span> by the Developer.
        </div>
    </motion.div>
);
