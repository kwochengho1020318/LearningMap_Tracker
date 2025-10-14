import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {  useNavigate } from "react-router-dom";


function DocsGrid({ items, onItemClick, onCreateNew }) {
    const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
const gotoChat = () => {
    navigate("/"); // 跳轉到 /about
  };
  return (
    <div className="App-header base">
    <div className="container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Docs</h3>
        <button className="btn btn-primary" onClick={gotoChat}>
          ＋ add
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="row g-3">
        {filtered.map((item, idx) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
            <div
              className="card h-100 shadow-sm"
              role="button"
              onClick={() => onItemClick(item, idx)}
            >
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  className="card-img-top"
                  alt={item.title}
                />
              ) : (
                <div className="card-img-top bg-light d-flex align-items-center justify-content-center"
                     style={{ height: "150px", fontSize: "2rem" }}>
                  {item.title.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="card-body">
                <h6 className="card-title text-truncate">{item.title}</h6>
                {item.subtitle && (
                  <p className="card-text text-muted small">{item.subtitle}</p>
                )}
                {item.updatedAt && (
                  <p className="text-muted small mb-0">{item.updatedAt}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default function DocsGridDemo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();
  
  // 一開始打 API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 假設這裡是你的 API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chat/map`,{credentials:"include"});
        const data = await response.json();
        if (response.status===401){ 
          navigate('/login',{replace:true})
        }
        // 轉換成我們需要的格式
        const mapped = data.data.map((d) => ({
          id: d.UUID,
          title: d.Definition.target,
          thumbnailUrl: d.thumbnailUrl,
          updatedAt: new Date().toISOString().slice(0, 10),
          destination:`/tracker/${d.UUID}`
        }));

        setItems(mapped);
      } catch (error) {
        console.error("API 錯誤:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleItemClick = (item) => {
    navigate(item.destination)
  };

  const handleCreate = () => {
    const n = items.length + 1;
    setItems([
      ...items,
      {
        id: String(n),
        title: `新文件 ${n}`,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  if (loading) {
    return <div className="base"></div>;
  }

  return <DocsGrid items={items} onItemClick={handleItemClick} onCreateNew={handleCreate} />;
}