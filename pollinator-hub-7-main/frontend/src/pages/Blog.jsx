import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, User, Loader2, ChevronLeft, ChevronRight, Globe2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; 
  
  // Header मधून आलेली भाषा ओळखण्यासाठी नवीन बदल
  const location = useLocation();
  const [activeLanguage, setActiveLanguage] = useState(location.state?.lang || 'English');

  // तुमची Google Sheet ची लिंक
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyF2p-ozMkvgYmglru9-s5-zN0NE2yMVBNcrUDj_YE51R29p-PU4btQFnpAXrnipDHhbw/exec";

  // जर युझरने Header मधून भाषा बदलली, तर पेजवर ती भाषा लगेच बदलण्यासाठी
  useEffect(() => {
    if (location.state?.lang) {
      setActiveLanguage(location.state.lang);
      setCurrentPage(1);
    }
  }, [location.state?.lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(GOOGLE_SHEET_URL, { redirect: 'follow', credentials: 'omit' })
      .then(res => res.json())
      .then(data => {
        setPosts(data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredPosts = posts.filter(post => {
    if (activeLanguage === 'English') {
      return !post.language || post.language.toLowerCase().trim() === 'english';
    } else {
      return post.language && post.language.toLowerCase().trim() !== 'english';
    }
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang) => {
    setActiveLanguage(lang);
    setCurrentPage(1);
  };

  return (
    <div className="pt-24 pb-20 bg-[#fcfaf5] min-h-screen">
      <section className="py-16 bg-[#f7f2e4] border-b border-[#eee6d3] mb-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-[#1c2a1e] mb-6">Our Latest Stories</h1>
          <p className="text-lg text-[#4a5a4c] max-w-2xl mx-auto mb-8">
            Insights, field updates, and inspiring stories from our mission to conserve native pollinators.
          </p>
          
          <div className="flex justify-center items-center gap-4 mt-8">
            <div className="bg-white p-1.5 rounded-full border border-[#eee6d3] shadow-sm inline-flex">
              <button 
                onClick={() => handleLanguageChange('English')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeLanguage === 'English' ? 'bg-[#2d5a3d] text-white shadow-md' : 'text-[#5a6f5c] hover:bg-[#f4ecd1]'}`}
              >
                <Globe2 className="w-4 h-4" /> English
              </button>
              <button 
                onClick={() => handleLanguageChange('Marathi')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeLanguage === 'Marathi' ? 'bg-[#2d5a3d] text-white shadow-md' : 'text-[#5a6f5c] hover:bg-[#f4ecd1]'}`}
              >
                मराठी / ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-[#2d5a3d]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Loading amazing stories...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl text-[#1c2a1e] font-display mb-2">Coming Soon!</h3>
            <p className="text-[#5a6f5c]">We are currently working on articles for this language.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => (
                <Link to={`/blog/${indexOfFirstPost + index}`} state={{ post }} key={index} className="bg-white rounded-2xl overflow-hidden border border-[#eee6d3] hover:shadow-xl transition-shadow group flex flex-col">
                  <div className="h-56 overflow-hidden relative flex-none bg-[#f4ecd1]">
                    <img 
                      src={post.image || 'https://placehold.co/800x600/e8e0c8/1c2a1e?text=BEPCoR+Blog'} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/e8e0c8/1c2a1e?text=BEPCoR+Blog'; }}
                      alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.category && <div className="absolute top-4 left-4 bg-[#f4ecd1] text-[#2d5a3d] text-xs font-bold px-3 py-1 rounded-full uppercase">{post.category}</div>}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-[#5a6f5c] mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(post.date)}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                    </div>
                    
                    {/* येथे आपण मराठी आणि इंग्रजी हेडलाईनसाठी वेगळा क्लास लावण्याची अट टाकली आहे */}
                    <h3 className={`text-2xl text-[#1c2a1e] mb-3 group-hover:text-[#2d5a3d] ${post.language && post.language.toLowerCase().trim() !== 'english' ? 'font-marathi-title' : 'font-display'}`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-[#4a5a4c] text-sm mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                    <div className="text-[#2d5a3d] font-semibold flex items-center gap-2 mt-auto">Read More <ArrowRight className="w-4 h-4" /></div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                  onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
                  className="p-2 rounded-full border border-[#eee6d3] text-[#2d5a3d] disabled:opacity-30 hover:bg-[#f4ecd1] transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-[#4a5a4c] font-medium">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
                  className="p-2 rounded-full border border-[#eee6d3] text-[#2d5a3d] disabled:opacity-30 hover:bg-[#f4ecd1] transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;