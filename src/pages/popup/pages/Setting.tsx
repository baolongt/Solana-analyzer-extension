import { useEffect, useState } from 'react';
import { Page } from '../types/page';
import Select from 'react-select';

const options = [
  { value: 'openai/gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
  { value: 'openai/gpt-4', label: 'gpt-4' },
];

const SettingsPage = ({ handleChangePage }: { handleChangePage: (page: Page) => void }) => {
  const [aiModel, setAiModel] = useState('openai/gpt-3.5-turbo');
  const [token, setToken] = useState('');

  const handleModelChange = event => {
    console.log('handleModelChange', event.value);
    setAiModel(event.value);
  };

  const handleTokenChange = event => {
    console.log('handleTokenChange', event.target.value);
    setToken(event.target.value);
  };

  const onSave = () => {
    console.log('aiModel:', aiModel);
    console.log('token:', token);
    console.log('save ai setting ', {
      ai_settings: {
        model: aiModel,
        token,
      },
    });
    chrome.storage.sync.set({
      ai_settings: {
        model: aiModel,
        token,
      },
    });

    chrome.storage.sync.get('ai_settings', async function (d) {
      if (d && Object.keys(d).length > 0) {
        console.log('ai settingg', d);
      }
    });

    chrome.storage.sync.get('settings', async function (d) {
      if (d && Object.keys(d).length > 0) {
        console.log('settingg', d);
      }
    });
  };

  useEffect(() => {
    chrome.storage.sync.get('ai_settings', async function (d) {
      console.log('first time', d);
      if (d && Object.keys(d).length > 0) {
        setAiModel(d.ai_settings.model);
        setToken(d.ai_settings.token);
      } else {
        setAiModel('openai/gpt-3.5-turbo');
        setToken('');
      }
    });
  }, []);

  useEffect(() => {
    console.log('change', {
      aiModel,
      token,
    });
  }, [aiModel, token]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
      <div className="fixed top-0 left-0 w-full shadow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <button
            onClick={() => handleChangePage(Page.MAIN_PAGE)}
            className="px-2 py-2 text-white rounded shadow hover:bg-slate-100 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="container mx-auto w-full px-4">
        <div className="mb-1">
          <label htmlFor="aiModel" className="block text-white text-sm font-bold mb-2">
            AI Model
          </label>
          <Select
            onChange={handleModelChange}
            value={options.find(option => option.value === aiModel)}
            options={options}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="token" className="block text-white text-sm font-bold mb-2">
            Token
          </label>
          <input
            value={token}
            onChange={handleTokenChange}
            id="token"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded shadow"
          />
        </div>
        <div className="mt-5 flex items-center justify-center">
          <button
            onClick={() => onSave()}
            className="mt-4 px-4 py-2 bg-white text-zinc-950 text-xl text-white rounded shadow hover:bg-slate-100">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
