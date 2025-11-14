import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: ${props => props.theme.spacing.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  ${props => props.clickable && `
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }
  `}
`;

export const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const CardDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

export default Card;