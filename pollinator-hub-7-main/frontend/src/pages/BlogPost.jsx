import React, { useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

const BlogPost = () => {
  const location = useLocation();
  const post = location.state?.post;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // जर कोणी डायरेक्ट लिंक उघडली आणि डेटा नसेल तर त्याला मुख्य ब्लॉग पेजवर पाठवणे
  if (!post) {
    return <Navigate to="/blog" />;
  }

  // हा फंक्शन मजकूर वाचून पॅरेग्राफ, टायटल्स आणि फोटो व्यवस्थित लावतो
  const renderContent = (text) => {
    if (!text) return null;
    
    // Alt+Enter (नवीन ओळीने) मजकूर तोडणे
    return text.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return null;

      // १. फोटो चेक करणे [IMAGE: url]
      const imgMatch = trimmedLine.match(/\[IMAGE:\s*(.+?)\]/i);
      if (imgMatch) {
        return (
          <div key={idx} className="my-10">
            <img src={imgMatch[1]} alt="Blog visual" className="w-full h-auto rounded-2xl shadow-sm" />
          </div>
        );
      }

      // २. टायटल चेक करणे **Title**
      const headingMatch = trimmedLine.match(/^\*\*(.+?)\*\*$/);
      if (headingMatch) {
        return (
          <h3 key={idx} className="font-display text-3xl text-[#1c2a1e] mt-10 mb-4 font-semibold">
            {headingMatch[1]}
          </h3>
        );
      }

      // ३. नेहमीचा पॅरेग्राफ
      return (
        <p key={idx} className="text-lg text-[#4a5a4c] mb-6 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="pt-28 pb-20 bg-[#fcfaf5] min-h-screen">
      <article className="max-w-3xl mx-auto px-5 md:px-8">
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#5a6f5c] hover:text-[#2d5a3d] font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all stories
        </Link>

        {post.category && (
          <div className="inline-block bg-[#f4ecd1] text-[#2d5a3d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            {post.category}
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1c2a1e] mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-[#5a6f5c] mb-10 pb-8 border-b border-[#eee6d3]">
          <span className="flex items-center gap-2"><User className="w-4 h-4" /> By {post.author}</span>
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
        </div>

        {post.image && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-md">
            <img src={post.image} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

      </article>
    </div>
  );
};

export default BlogPost;