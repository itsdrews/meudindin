// src/pages/UserManagement.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const Page = styled.div`width:100%;`;
const Card = styled.div`
  background: ${p => p.$darkMode ? '#2d1b4e' : 'white'};
  border: 1px solid ${p => p.$darkMode ? '#4c1d95' : '#e2e8f0'};
  border-radius: 16px;
  padding: 24px;
`;
const Row = styled.div`display:flex; justify-content:space-between; align-items:center; gap:12px;`;
const Title = styled.h2`margin:0; color:${p => p.$darkMode ? '#f8fafc' : '#0f172a'};`;
const Small = styled.p`margin:4px 0 0; color:${p => p.$darkMode ? '#a78bfa' : '#64748b'};`;
const Button = styled.button`
  padding:10px 14px; border-radius:10px; border:none; cursor:pointer;
  background:${p => p.$danger ? '#ef4444' : p.$primary ? 'linear-gradient(135deg,#667eea,#764ba2)' : (p.$darkMode ? '#3b2167' : 'white')};
  color:${p => p.$danger || p.$primary ? '#fff' : p.$darkMode ? '#c4b5fd' : '#475569'};
  border:1px solid ${p => p.$darkMode ? '#4c1d95' : '#e2e8f0'};
`;
const Field = styled.input`
  width:100%; padding:10px; border-radius:8px; border:1px solid ${p => p.$darkMode ? '#4c1d95' : '#cbd5e1'};
  background:${p => p.$darkMode ? '#3b2167' : 'white'}; color:${p => p.$darkMode ? 'white' : '#0f172a'};
`;
const ModalOverlay = styled.div`position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; justify-content:center; align-items:center;`;
const ModalCard = styled.div`width:480px; padding:20px; border-radius:12px; background:${p => p.$darkMode ? '#2d1b4e' : 'white'}; border:1px solid ${p => p.$darkMode ? '#4c1d95' : '#e2e8f0'};`;

const UserManagement = ({ darkMode=false }) => {
  const { user, logout, updateLocalUser } = useAuth();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailPassword, setEmailPassword] = useState('');

  if (!user) return <p>Usuário não encontrado.</p>;

  const handleUpdateName = async () => {
    if (!nome) return alert('Nome inválido');
    setLoading(true);
    try {
      const res = await userService.updateName(user.id, nome);
      const updated = res.cliente || res.cliente || res.cliente || res; // backend retorna {cliente: ...} ou {cliente}
      // atualiza local
      const newLocal = { ...user, nome };
      updateLocalUser(newLocal);
      setShowNameModal(false);
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao atualizar nome');
    } finally { setLoading(false); }
  };

  const handleUpdateEmail = async () => {
    if (!email) return alert('Email inválido');
    if (!emailPassword) return alert('Informe sua senha atual');
    setLoading(true);

    try {
      await userService.updateEmail(user.id, email, emailPassword);

      const newLocal = { ...user, email };
      updateLocalUser(newLocal);

      setShowEmailModal(false);
      setEmailPassword('');
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao atualizar email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) return alert('Preencha as senhas');
    setLoading(true);
    try {
      await userService.updatePassword(user.id, currentPassword, newPassword);
      alert('Senha atualizada com sucesso');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao atualizar senha');
    } finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Excluir sua conta é irreversível. Confirma?')) return;
    setLoading(true);
    try {
      await userService.deleteAccount(user.id);
      // limpa local e redireciona para login
      logout();
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao deletar conta');
    } finally { setLoading(false); }
  };

  return (
    <Page>
      <Row style={{marginBottom: 16}}>
        <div>
          <Title $darkMode={darkMode}>Perfil</Title>
          <Small $darkMode={darkMode}>Gerencie suas informações pessoais</Small>
        </div>
        <div style={{display:'flex', gap:12}}>
          <Button onClick={() => setShowNameModal(true)} $primary $darkMode={darkMode}>
            Editar Nome
          </Button>
          <Button onClick={() => setShowEmailModal(true)} $primary $darkMode={darkMode}>
            Editar Email
          </Button>
          <Button onClick={() => setShowPasswordModal(true)} $darkMode={darkMode}>
            Alterar Senha
          </Button>
          <Button onClick={() => setShowDeleteModal(true)} $danger $darkMode={darkMode}>
            Excluir Conta
          </Button>
        </div>
      </Row>

      <Card $darkMode={darkMode}>
        <h3 style={{margin:0}}>{user.nome}</h3>
        <p style={{margin:'6px 0 0 0', color: darkMode ? '#a78bfa' : '#64748b'}}>{user.email}</p>
        <p style={{marginTop:12, opacity:0.8}}>CPF: {user.cpf}</p>
        <p style={{marginTop:4, opacity:0.8}}>Cadastrado em: {new Date(user.data_cadastro).toLocaleDateString()}</p>
      </Card>

      {/* Modal Nome */}
      {showNameModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <h3>Editar Nome</h3>
            <Field value={nome} onChange={e => setNome(e.target.value)} $darkMode={darkMode} />
            <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:12}}>
              <Button onClick={() => setShowNameModal(false)} $darkMode={darkMode}>Cancelar</Button>
              <Button onClick={handleUpdateName} $primary disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Modal Email */}
      {showEmailModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <h3>Editar Email</h3>

            {/* Campo de novo email */}
            <Field
              placeholder="Novo email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              $darkMode={darkMode}
              style={{ marginBottom: 12 }}   // <<< espaçamento igual ao modal de senha
            />

            {/* Campo de senha atual */}
            <Field
              type="password"
              placeholder="Senha atual"
              value={emailPassword}
              onChange={e => setEmailPassword(e.target.value)}
              $darkMode={darkMode}
            />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:12 }}>
              <Button 
                onClick={() => { setShowEmailModal(false); setEmailPassword(''); }} 
                $darkMode={darkMode}
              >
                Cancelar
              </Button>

              <Button 
                onClick={handleUpdateEmail} 
                $primary 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Modal Senha */}
      {showPasswordModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <h3>Alterar Senha</h3>

            <Field
              style={{ marginBottom: 12 }}
              type="password"
              placeholder="Senha atual"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              $darkMode={darkMode}
            />

            <Field
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              $darkMode={darkMode}
            />

            <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:12}}>
              <Button onClick={() => setShowPasswordModal(false)} $darkMode={darkMode}>Cancelar</Button>
              <Button onClick={handleUpdatePassword} $primary disabled={loading}>
                {loading ? 'Alterando...' : 'Alterar senha'}
              </Button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Modal Deletar */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalCard $darkMode={darkMode}>
            <h3>Excluir perfil</h3>
            <p>A exclusão é irreversível. Todos os dados serão apagados.</p>
            <div style={{display:'flex', justifyContent:'flex-end', gap:10, marginTop:12}}>
              <Button onClick={() => setShowDeleteModal(false)} $darkMode={darkMode}>Cancelar</Button>
              <Button onClick={handleDeleteAccount} $danger disabled={loading}>{loading ? 'Excluindo...' : 'Excluir Conta'}</Button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}
    </Page>
  );
};

export default UserManagement;
