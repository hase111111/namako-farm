// src/components/AuthPage.tsx
import React, { useState } from 'react';

// 親コンポーネント（App.tsx）から「ログイン成功時に実行する関数」を受け取るための型定義
interface AuthPageProps {
  onLoginSuccess: (username: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  // ログイン用のState
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // 新規登録用のState
  const [registerUser, setRegisterUser] = useState('');
  const [registerPass, setRegisterPass] = useState('');

  // ログインボタンを押した時
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) {
      alert('ユーザーネームとパスワードを入力してください');
      return;
    }
    // 今はどんな入力でもログイン成功扱いにする
    console.log('ログイン試行:', { loginUser, loginPass });
    onLoginSuccess(loginUser);
  };

  // 新規登録ボタンを押した時
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerUser || !registerPass) {
      alert('ユーザーネームとパスワードを入力してください');
      return;
    }
    // 今はどんな入力でも登録＆ログイン成功扱いにする
    console.log('新規登録試行:', { registerUser, registerPass });
    onLoginSuccess(registerUser);
  };

  return (
    <div style={styles.container}>
      <h2>育成ゲームへようこそ</h2>
      
      <div style={styles.flexBox}>
        {/* ログインフォーム */}
        <form onSubmit={handleLogin} style={styles.card}>
          <h3>ログイン</h3>
          <div style={styles.inputGroup}>
            <label>ユーザーネーム：</label>
            <input 
              type="text" 
              value={loginUser} 
              onChange={(e) => setLoginUser(e.target.value)} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label>パスワード：</label>
            <input 
              type="password" 
              value={loginPass} 
              onChange={(e) => setLoginPass(e.target.value)} 
            />
          </div>
          <button type="submit" style={styles.button}>ログイン</button>
        </form>

        {/* 新規登録フォーム */}
        <form onSubmit={handleRegister} style={styles.card}>
          <h3>新規登録</h3>
          <div style={styles.inputGroup}>
            <label>ユーザーネーム：</label>
            <input 
              type="text" 
              value={registerUser} 
              onChange={(e) => setRegisterUser(e.target.value)} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label>パスワード：</label>
            <input 
              type="password" 
              value={registerPass} 
              onChange={(e) => setRegisterPass(e.target.value)} 
            />
          </div>
          <button type="submit" style={styles.button}>新規登録して開始</button>
        </form>
      </div>
    </div>
  );
};

// 簡易的なスタイル（見た目が崩れないように最小限のCSSをインラインで適用）
const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' },
  flexBox: { display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' },
  card: { border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', minWidth: '280px', textAlign: 'left' },
  inputGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  button: { width: '100%', padding: '0.7rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};
