// src/App.tsx
import { useState } from 'react';
import { AuthPage } from './components/AuthPage';
import { AquaculturePage } from './components/AquaculturePage'; // 追加

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const handleLoginSuccess = (username: string) => {
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    // 仕様：ログアウト時にデータを保存する（現状はアラートを出すだけ）
    alert('現在の資金と養殖データをローカルに疑似保存しました（後ほどAPI連携）');
    setLoggedInUser(null);
  };

  return (
    <div>
      {loggedInUser === null ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        // ダミー画面を本物の養殖画面コンポーネントに差し替え
        <AquaculturePage username={loggedInUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;