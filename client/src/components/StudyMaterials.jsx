import React, { useState, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StudyMaterials = () => {
  const [selectedSubject, setSelectedSubject] = useState("Biology");
  const [materials, setMaterials] = useState([]);
  const [subjectsCount, setSubjectsCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const subjects = [
    { name: "Biology", icon: "🧬", color: "bg-green-500" },
    { name: "Chemistry", icon: "⚗️", color: "bg-blue-500" },
    { name: "Physics", icon: "⚡", color: "bg-purple-500" },
    { name: "Mathematics", icon: "📐", color: "bg-red-500" },
  ];

  const fetchSubjectsCount = useCallback(async (refreshType = 'initial') => {
    try {
      console.log(`Fetching subjects count (${refreshType})...`);
      const response = await axios.get(
        `${API_BASE}/api/study-materials/subjects`,
      );
      
      // Remove duplicates by subject name and ensure unique entries
      const uniqueData = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.subject === current.subject);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setSubjectsCount(uniqueData || []);
    } catch (error) {
      console.error("Error fetching subjects count:", error);
    }
  }, []);

  const fetchMaterials = useCallback(async (subject, refreshType = 'initial') => {
    try {
      console.log(`Fetching materials for ${subject} (${refreshType})...`);
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/api/study-materials/subject/${subject}`,
      );
      
      // Remove duplicates by ID and ensure unique entries
      const uniqueData = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setMaterials(uniqueData || []);
    } catch (error) {
      console.error("Error fetching study materials:", error);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the auto-refresh hook for subjects count
  useAutoRefresh(fetchSubjectsCount, [], 30000);

  // Use the auto-refresh hook for materials
  useAutoRefresh(() => {
    if (selectedSubject) {
      fetchMaterials(selectedSubject);
    }
  }, [selectedSubject, fetchMaterials], 30000);

  const handleSubjectSelect = useCallback((subject) => {
    setSelectedSubject(subject);
    setSelectedVideo(null);
  }, []);

  const handleVideoSelect = useCallback((video) => {
    setSelectedVideo(video);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const getSubjectCount = (subjectName) => {
    const subject = subjectsCount.find((s) => s.subject === subjectName);
    return subject ? subject.count : 0;
  };

  const extractVideoId = (url) => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="space-y-6">
      {/* Subject Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Subject
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => handleSubjectSelect(subject.name)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedSubject === subject.name
                  ? `${subject.color} text-white border-transparent shadow-lg`
                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div className="text-2xl mb-2">{subject.icon}</div>
              <div className="font-medium">{subject.name}</div>
              <div className="text-sm opacity-75">
                {getSubjectCount(subject.name)} videos
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Subject Materials */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedSubject} - Study Materials
          </h3>
          <span className="text-sm text-gray-500">
            {materials.length} videos available
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading study materials..." />
        ) : materials.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Materials Available
            </h4>
            <p className="text-gray-600">
              No study materials found for {selectedSubject}. Check back later for new content.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleVideoSelect(material)}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <iframe
                      src={getEmbedUrl(material.videoUrl)}
                      title={material.topic}
                      className="w-full h-48"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {material.topic}
                    </h4>
                    {material.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {material.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {material.subject}
                      </span>
                      {material.duration && <span>{material.duration}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVideo.topic}
              </h3>
              <button
                onClick={handleCloseVideo}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.topic}
                  className="w-full h-96"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {selectedVideo.subject}
                  </span>
                  {selectedVideo.duration && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {selectedVideo.duration}
                    </span>
                  )}
                </div>

                {selectedVideo.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
