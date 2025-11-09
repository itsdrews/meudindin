import styled from 'styled-components';

export const GradientButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  font-size: ${props => props.size === 'lg' ? '1.125rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;
  position: relative;
  overflow: hidden;
  
  background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  background-size: 200% 100%;
  background-position: 100% 0;
  
  &:hover {
    background-position: 0 0;
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(37, 99, 235, 0.25),
      0 4px 12px rgba(124, 58, 237, 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:focus {
    box-shadow: 
      0 0 0 3px rgba(37, 99, 235, 0.2),
      0 0 0 1px rgba(124, 58, 237, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

export default GradientButton;