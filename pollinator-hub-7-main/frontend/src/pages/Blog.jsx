import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // तुमची नवीन Google Sheet ची लिंक या दोन अवतरण चिन्हांच्या मध्ये टाका
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyF2p-ozMkvgYmglru9-s5-zN0NE2yMVBNcrUDj_YE51R29p-PU4btQFnpAXrnipDHhbw/exec";

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // गुगल शीट मधून डेटा आणणे (credentials: 'omit' सोबत)
    fetch(GOOGLE_SHEET_URL, {
      redirect: 'follow',
      credentials: 'omit'
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-24 pb-20 bg-[#fcfaf5] min-h-screen">
      
      {/* Blog Header */}
      <section className="py-16 bg-[#f7f2e4] border-b border-[#eee6d3] mb-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
          <h1 className="font-display text-4xl md:text-6xl text-[#1c2a1e] mb-6">Our Latest Stories</h1>
          <p className="text-lg text-[#4a5a4c] max-w-2xl mx-auto">
            Insights, field updates, and inspiring stories from our mission to conserve native pollinators and empower rural communities.
          </p>
        </div>
      </section>

      {/* Blog Cards */}
      <section className="max-w-6xl mx-auto px-5 md:px-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-[#2d5a3d]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-lg font-medium">Loading amazing stories...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link 
                to={`/blog/${index}`} 
                state={{ post }} 
                key={index} 
                className="bg-white rounded-2xl overflow-hidden border border-[#eee6d3] hover:shadow-xl transition-shadow group flex flex-col"
              >
                <div className="h-56 overflow-hidden relative flex-none">
                  <img 
                    src={post.image || 'https://via.placeholder.com/800x600?text=BEPCoR+Blog'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-[#f4ecd1] text-[#2d5a3d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-[#5a6f5c] mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#1c2a1e] mb-3 leading-tight group-hover:text-[#2d5a3d] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[#4a5a4c] text-sm mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="text-[#2d5a3d] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;