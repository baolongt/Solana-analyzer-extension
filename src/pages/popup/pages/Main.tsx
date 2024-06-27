import React, { useEffect, useState } from 'react';
import { Page } from '../types/page';

const MainPage = ({ handleChangePage }: { handleChangePage: (page: Page) => void }) => {
  const [isStop, setIsStop] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get('settings', async function (d) {
      console.log('settings', d);
      if (d && Object.keys(d).length > 0) {
        // Settings exist
        setIsStop(d.settings.isStop);
      } else {
        // Settings do not exist, create them
        const defaultSettings = {
          isStop: false,
        };
        chrome.storage.sync.set({ settings: defaultSettings }, function () {
          console.log('Default settings have been saved');
        });

        setIsStop(defaultSettings.isStop);
      }
    });
  }, []);

  const handleStop = () => {
    chrome.storage.sync.get('settings', async function (d) {
      if (d && Object.keys(d).length > 0) {
        const settings = d.settings;
        const newSettings = {
          ...settings,
          isStop: !settings.isStop,
        };
        chrome.storage.sync.set({ settings: newSettings }, function () {
          console.log('Settings have been saved');
        });

        setIsStop(newSettings.isStop);
      }
    });
  };

  return (
    <div className="w-screen flex items-center justify-center">
      <div className="fixed top-0 left-0 w-full shadow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <button
            onClick={() => handleChangePage(Page.SETTING_PAGE)}
            className="px-2 py-2 text-white rounded shadow hover:bg-slate-100 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-48 flex items-center justify-center">
        <button
          onClick={() => handleStop()}
          className="mt-4 px-4 py-2 bg-white text-zinc-950 text-xl text-white rounded shadow hover:bg-slate-100">
          {isStop ? (
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mt-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
              Start
            </div>
          ) : (
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mt-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
              Stop
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default MainPage;
