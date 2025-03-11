"use client";
import React from 'react';

function Modal({ isOpen,onClose }:any) {
  if (!isOpen) return null;

  return (
    <div id="crud-modal" tabIndex={-1} aria-hidden="true" className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-slate-200 bg-opacity-90 scroll-auto">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className=" bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Yeni Etkinlik Oluştur
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 cursor-pointer">
              ✖
            </button>
          </div>
          <form className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Etkinlik Adı</label>
                <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Etkinlik Adı" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tarih</label>
                <input type="date"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
             
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Saat</label>
                <input type="time"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
             
              </div>
              {/* <div className="col-span-2 sm:col-span-1 w-full">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori</label>
                <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option>Kategori Seçin</option>
                  <option value="TV">TV/Monitors</option>
                  <option value="PC">PC</option>
                  <option value="GA">Gaming/Console</option>
                  <option value="PH">Phones</option>
                </select>
              </div> */}
              <div className="col-span-2 sm:col-span-1 w-full">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Etkinlik Türü</label>
                <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option>Tür seçin</option>
                  <option value="TV">Online</option>
                  <option value="PC">Yüz Yüze</option>
                </select>
              </div>
              <div className="col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Açıklama</label>
                <textarea id="description" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Örn: konular, program vb."></textarea>
              </div>
            </div>
            <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Yeni Etkinlik Oluştur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;