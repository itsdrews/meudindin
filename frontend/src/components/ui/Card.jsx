import styled from 'styled-components';

export const Card = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.clickable && `
    cursor: pointer;
    transition: box-shadow 0.2s ease-in-out;
    
    &:hover {
      box-shadow: ${props.theme.shadows.md};
    }
  `}
`;

export const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const CardDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

export default Card;