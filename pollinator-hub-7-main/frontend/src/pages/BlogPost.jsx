import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Facebook, MessageCircle, Link2, Linkedin, Loader2 } from 'lucide-react';

const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [post, setPost] = useState(location.state?.post || null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // तुमची Google Sheet ची लिंक
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyF2p-ozMkvgYmglru9-s5-zN0NE2yMVBNcrUDj_YE51R29p-PU4btQFnpAXrnipDHhbw/exec";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let currentPost = location.state?.post || null;
    if (currentPost) {
      setPost(currentPost);
    } else {
      setLoading(true);
    }

    fetch(GOOGLE_SHEET_URL, { redirect: 'follow', credentials: 'omit' })
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((p, index) => ({ ...p, originalId: index }));
        const reversed = [...mappedData].reverse();
        
        if (!currentPost) {
          const postIndex = parseInt(id, 10);
          currentPost = mappedData.find(p => p.originalId === postIndex);
          
          if (currentPost) {
            setPost(currentPost);
          } else {
            navigate('/blog');
            return;
          }
        }

        const filtered = reversed.filter(p => p.originalId !== currentPost.originalId).slice(0, 3);
        setRecentPosts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        if (!currentPost) navigate('/blog');
      });
  }, [id, location.key, location.state?.post, navigate]);

  if (loading && !post) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-screen bg-[#fcfaf5]">
        <style>{`
          /* ग्रॅडियंट रंग जो एकदा भरला की कायम राहील (forwards मुळे) */
          .hex-gradient-fill {
            stroke-dasharray: 100;
            animation: fillGradient 2.5s linear forwards; 
          }
          /* पांढरा पॉईंट जो सतत फिरत राहील (infinite मुळे) */
          .hex-dot {
            stroke-dasharray: 0.1 99.9;
            animation: traceDot 2.5s linear infinite; 
          }
          
          @keyframes fillGradient {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes traceDot {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
        `}</style>
        
        <div className="mb-5 flex items-center justify-center">
          <svg width="42" height="42" viewBox="0 0 50 50" className="drop-shadow-md">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2b4c9b" />
                <stop offset="50%" stopColor="#0b827a" />
                <stop offset="100%" stopColor="#00a752" />
              </linearGradient>
            </defs>

            {/* १. सर्वात खालचा स्थिर रस्ता (मूळ हिरवा रंग) */}
            <polygon 
              points="25,3 45,14.5 45,35.5 25,47 5,35.5 5,14.5" 
              fill="none" 
              stroke="#2d5a3d" 
              strokeWidth="7" 
              strokeLinejoin="round"
            />
            {/* २. पांढऱ्या पॉईंटच्या मागे धावणारा आणि कायम राहणारा ग्रॅडियंट रंग */}
            <polygon 
              points="25,3 45,14.5 45,35.5 25,47 5,35.5 5,14.5" 
              fill="none" 
              stroke="url(#logoGradient)" 
              strokeWidth="7" 
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="100"
              className="hex-gradient-fill" 
            />
            {/* ३. आतून फिरणारा पांढरा गोल (सर्वात वर) */}
            <polygon 
              points="25,3 45,14.5 45,35.5 25,47 5,35.5 5,14.5" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="100"
              className="hex-dot" 
            />
          </svg>
        </div>
        <p className="text-[#5a6f5c] font-medium tracking-wide">Loading...</p>
      </div>
    );
  }

  if (!post) return null;

  const lang = post.language ? post.language.toLowerCase().trim() : 'english';
  
  let shareTitle = 'Share this article';
  let copyLinkText = 'Copy Link';
  let linkCopiedAlert = 'Link Copied!';
  
  if (lang.includes('kannada')) {
    shareTitle = 'ಈ ಲೇಖನವನ್ನು ಶೇರ್ ಮಾಡಿ';
    copyLinkText = 'ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ';
    linkCopiedAlert = 'ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!';
  } else if (lang !== 'english') {
    shareTitle = 'हा लेख शेअर करा';
    copyLinkText = 'लिंक कॉपी करा';
    linkCopiedAlert = 'लिंक कॉपी केली!';
  }

  const fontClass = (lang !== 'english') ? 'font-marathi-title' : 'font-display';

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
              
              <h1 className={`text-4xl text-[#1c2a1e] mb-10 leading-tight ${fontClass}`}>
                {post.title}
              </h1>
              
              <div className="prose max-w-none">{renderContent(post.content)}</div>

              <div className="mt-10 pt-6 border-t border-[#eee6d3]">
                <h4 className="text-lg font-bold text-[#1c2a1e] mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#2d5a3d]" /> 
                  {shareTitle}
                </h4>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + " - " + window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#25D366] text-white rounded-full hover:bg-[#1ebd59] transition-all font-medium shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1877F2] text-white rounded-full hover:bg-[#166fe5] transition-all font-medium shadow-sm"
                  >
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[#0A66C2] text-white rounded-full hover:bg-[#084e96] transition-all font-medium shadow-sm"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert(linkCopiedAlert);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[#eee6d3] text-[#1c2a1e] rounded-full hover:bg-[#f4ecd1] transition-all font-medium shadow-sm"
                  >
                    <Link2 className="w-4 h-4 text-[#2d5a3d]" /> 
                    {copyLinkText}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-[#eee6d3] shadow-sm">
              <h3 className="font-display text-2xl text-[#1c2a1e] mb-6 border-b border-[#eee6d3] pb-4">
                New On The Blog
              </h3>
              <div className="flex flex-col gap-6">
                {recentPosts.map((rPost) => (
                  <Link 
                    key={rPost.originalId} 
                    to={`/blog/${rPost.originalId}`} 
                    state={{ post: rPost }} 
                    className="flex gap-4 group items-start"
                  >
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