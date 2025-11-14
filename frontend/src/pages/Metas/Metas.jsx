import React from 'react';

const Metas = ({ darkMode }) => {
  return (
    <div style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
      <h2>Metas</h2>
      <p>Em breve: acompanhamento de metas.</p>
    </div>
  );
};

export default Metas;
