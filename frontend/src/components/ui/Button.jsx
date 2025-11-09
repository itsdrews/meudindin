import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
      case 'lg': return `${props.theme.spacing.md} ${props.theme.spacing.xl}`;
      default: return `${props.theme.spacing.sm} ${props.theme.spacing.lg}`;
    }
  }};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: none;
  position: relative;
  overflow: hidden;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: transparent;
          color: ${props.theme.colors.primary};
          border: 1px solid ${props.theme.colors.primary};
          
          &:hover {
            background-color: ${props.theme.colors.primary};
            color: white;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${props.theme.colors.text.primary};
          border: 1px solid ${props.theme.colors.border};
          
          &:hover {
            background-color: ${props.theme.colors.background};
          }
        `;
      default:
        return `
          background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          background-size: 200% 100%;
          background-position: 100% 0;
          
          &:hover {
            background-position: 0 0;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

export default Button;