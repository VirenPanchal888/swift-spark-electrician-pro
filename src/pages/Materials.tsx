
import React from 'react';
import Navbar from '@/components/Navbar';
import MaterialForm from '@/components/MaterialForm';
import MaterialList from '@/components/MaterialList';

const Materials = () => {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <h1 className="section-title">Materials Management</h1>
        <div className="grid grid-cols-1 gap-8">
          <MaterialForm />
          <MaterialList />
        </div>
      </main>
    </>
  );
};

export default Materials;
