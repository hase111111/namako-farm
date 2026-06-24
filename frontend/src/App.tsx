// src/App.tsx
import { useState } from 'react';
import { AuthPage } from './components/AuthPage';

function App() {
  // ログイン中のユーザー名を管理するState（null の時は未ログイン）
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // ログインに成功したときに実行される関数
  const handleLoginSuccess = (username: string) => {
    setLoggedInUser(username);
  };

  // ログアウト処理
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <div>
      {loggedInUser === null ? (
        // 未ログインなら、認証ページを表示
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        // ログイン済みなら、ゲーム本編を表示（ひとまず仮の画面）
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>育成ゲーム本編（メイン画面）</h1>
          <p>ようこそ、 <strong>{loggedInUser}</strong> さん！</p>
          <p>ここは将来的にモンスターやキャラクターを育てる画面になります。</p>
          
          <div style={{ margin: '2rem 0', padding: '2rem', border: '2px dashed #999', borderRadius: '8px' }}>
            <p>🐾 キャラクターのステータス（仮）</p>
            <p>LV: 1 | HP: 100 / 100</p>
          </div>

          <button 
            onClick={handleLogout} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
