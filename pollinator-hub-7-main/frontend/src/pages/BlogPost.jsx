import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  
  // नवीन ब्लॉग्स आणण्यासाठी स्टेट
  const [recentPosts, setRecentPosts] = useState([]);
  
  // तुमची Google Sheet ची लिंक इथे टाका
  const GOOGLE_SHEET_URL = "तुमची_नवीन_लिंक_इथे_पेस्ट_करा";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog');
      return;
    }

    // साईडबारसाठी नवीन ब्लॉग्स आणणे
    fetch(GOOGLE_SHEET_URL, { redirect: 'follow', credentials: 'omit' })
      .then(res => res.json())
      .then(data => {
        const reversed = data.reverse();
        // जो ब्लॉग आपण वाचत आहोत तो वगळून, बाकीचे ३ नवीन ब्लॉग साईडबारमध्ये दाखवणे
        const filtered = reversed.filter(p => p.title !== post.title).slice(0, 3);
        setRecentPosts(filtered);
      })
      .catch(err => console.error(err));
  }, [post, navigate]);

  if (!post) return null;

  // मजकूर आणि फोटो डिझाईन
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, pIndex) => {
      if (!paragraph.trim()) return <br key={pIndex} />;
      const imgMatch = paragraph.match(/\[IMAGE:\s*(.*?)\s*\]/);
      if (imgMatch) {
        return (
          <img key={pIndex} src={imgMatch[1]} alt="Content" className="w-full rounded-xl my-8 shadow-md" />
        );
      }
      const boldParts = paragraph.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={pIndex} className="mb-5 text-lg text-[#4a5a4c] leading-relaxed">
          {boldParts.map((part, bIndex) => bIndex % 2 === 1 ? <strong key={bIndex} className="font-bold text-[#1c2a1e] text-xl">{part}</strong> : part)}
        </p>
      );
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="pt-24 pb-20 bg-[#fcfaf5] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#5a6f5c] hover:text-[#2d5a3d] transition-colors mb-8 font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Blogs
        </Link>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* डावी बाजू: मुख्य ब्लॉग (२ कॉलमची जागा घेईल) */}
          <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden border border-[#eee6d3] shadow-lg">
            <div className="h-[400px] w-full bg-[#f4ecd1]">
              <img 
                src={post.image || 'https://placehold.co/1200x600/e8e0c8/1c2a1e?text=BEPCoR+Blog'} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x600/e8e0c8/1c2a1e?text=BEPCoR+Blog'; }}
                alt={post.title} className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#5a6f5c] mb-6 border-b border-[#eee6d3] pb-6">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</span>
                {post.category && <span className="bg-[#f4ecd1] text-[#2d5a3d] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{post.category}</span>}
              </div>
              <h1 className="font-display text-4xl text-[#1c2a1e] mb-10 leading-tight">{post.title}</h1>
              <div className="prose max-w-none">{renderContent(post.content)}</div>
            </div>
          </div>

          {/* उजवी बाजू: Sidebar - New On The Blog (१ कॉलमची जागा घेईल) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-[#eee6d3] shadow-sm">
              <h3 className="font-display text-2xl text-[#1c2a1e] mb-6 border-b border-[#eee6d3] pb-4">
                New On The Blog
              </h3>
              <div className="flex flex-col gap-6">
                {recentPosts.map((rPost, index) => (
                  <Link 
                    key={index} 
                    to={`/blog/${Date.now() + index}`} 
                    state={{ post: rPost }} 
                    className="flex gap-4 group items-start"
                  >
                    <img 
                      src={rPost.image && rPost.image.startsWith('http') ? rPost.image : 'https://placehold.co/150x150/e8e0c8/1c2a1e?text=Blog'} 
                      className="w-20 h-20 object-cover rounded-lg flex-none" 
                      alt="thumbnail"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-medium text-[#1c2a1e] group-hover:text-[#2d5a3d] leading-tight line-clamp-3 transition-colors">
                        {rPost.title}
                      </h4>
                      <span className="text-xs text-[#5a6f5c] mt-2">{formatDate(rPost.date)}</span>
                    </div>
                  </Link>
                ))}
                {recentPosts.length === 0 && <p className="text-sm text-[#5a6f5c]">More stories coming soon!</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogPost;