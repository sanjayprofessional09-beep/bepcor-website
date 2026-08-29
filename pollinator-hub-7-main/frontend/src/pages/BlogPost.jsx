import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Facebook, MessageCircle, Link2, Linkedin } from 'lucide-react';

const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  
  const [recentPosts, setRecentPosts] = useState([]);
  
  // तुमची Google Sheet ची लिंक इथे टाका
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyF2p-ozMkvgYmglru9-s5-zN0NE2yMVBNcrUDj_YE51R29p-PU4btQFnpAXrnipDHhbw/exec";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) {
      navigate('/blog');
      return;
    }

    fetch(GOOGLE_SHEET_URL, { redirect: 'follow', credentials: 'omit' })
      .then(res => res.json())
      .then(data => {
        const reversed = data.reverse();
        const filtered = reversed.filter(p => p.title !== post.title).slice(0, 3);
        setRecentPosts(filtered);
      })
      .catch(err => console.error(err));
  }, [post, navigate]);

  if (!post) return null;

  // ब्लॉगची भाषा मराठी आहे की इंग्रजी हे ओळखण्यासाठी अट
  const isMarathi = post.language && post.language.toLowerCase().trim() !== 'english';

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* डावी बाजू: मुख्य ब्लॉग */}
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
              
              <h1 className={`text-4xl text-[#1c2a1e] mb-10 leading-tight ${isMarathi ? 'font-marathi-title' : 'font-display'}`}>
                {post.title}
              </h1>
              
              <div className="prose max-w-none">{renderContent(post.content)}</div>

              {/* --- शेअरिंग सेक्शन --- */}
              <div className="mt-10 pt-6 border-t border-[#eee6d3]">
                <h4 className="text-lg font-bold text-[#1c2a1e] mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#2d5a3d]" /> 
                  {isMarathi ? 'हा लेख शेअर करा' : 'Share this article'}
                </h4>
                
                <div className="flex flex-wrap gap-3">
                  {/* WhatsApp Share */}
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + " - " + window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#25D366] text-white rounded-full hover:bg-[#1ebd59] transition-all font-medium shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>

                  {/* Facebook Share */}
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1877F2] text-white rounded-full hover:bg-[#166fe5] transition-all font-medium shadow-sm"
                  >
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>

                  {/* LinkedIn Share */}
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#0A66C2] text-white rounded-full hover:bg-[#084e96] transition-all font-medium shadow-sm"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>

                  {/* Copy Link Button */}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert(isMarathi ? 'लिंक कॉपी केली!' : 'Link Copied!');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[#eee6d3] text-[#1c2a1e] rounded-full hover:bg-[#f4ecd1] transition-all font-medium shadow-sm"
                  >
                    <Link2 className="w-4 h-4 text-[#2d5a3d]" /> 
                    {isMarathi ? 'लिंक कॉपी करा' : 'Copy Link'}
                  </button>
                </div>
              </div>
              {/* --- शेअरिंग सेक्शन समाप्त --- */}

            </div>
          </div>

          {/* उजवी बाजू: Sidebar */}
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
                    {/* येथे फोटोचा प्रॉब्लेम सोडवला आहे */}
                    <img 
                      src={rPost.image || 'https://placehold.co/150x150/e8e0c8/1c2a1e?text=Blog'} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/e8e0c8/1c2a1e?text=Blog'; }}
                      className="w-20 h-20 object-cover rounded-lg flex-none bg-[#f4ecd1]" 
                      alt={rPost.title || "thumbnail"}
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