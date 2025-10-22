import styled from 'styled-components';

export const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, ${props => props.$open ? 0.35 : 0});
  transition: background 200ms ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 50;
`;

export const Modal = styled.div<{ $open: boolean }>`
  width: 402px;
  max-width: 100%;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
  transform: translateY(${props => props.$open ? 0 : 24}px);
  opacity: ${props => props.$open ? 1 : 0};
  transition: transform 200ms ease, opacity 200ms ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ModalSpacer = styled.div`
  width: 32px;
`;

export const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
`;

export const AmountSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const IconWrapper = styled.div<{ $isNaver?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  ${props => props.$isNaver ? 'overflow: hidden;' : 'background: #0090FF;'}
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: ${props => props.$isNaver ? '100%' : '24px'};
    height: ${props => props.$isNaver ? '100%' : '16px'};
    object-fit: ${props => props.$isNaver ? 'cover' : 'contain'};
  }
`;

export const Amount = styled.div`
  font-size: 28px;
  font-weight: 800;
`;

export const FieldGrid = styled.div`
  display: grid;
  row-gap: 16px;
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FieldLabel = styled.div`
  color: #4b5563;
`;

export const FieldValue = styled.div<{ $accent?: boolean }>`
  color: ${props => props.$accent ? '#1d4ed8' : '#111'};
  font-weight: 500;
`;

export const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 16px 0;
`;

export const InfoGrid = styled.div`
  display: grid;
  row-gap: 12px;
`;

export const DutchPayButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #f3f4f6;
  border-radius: 12px;
  border: none;
  color: #111;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
`;

export const ToggleButton = styled.button<{ $on: boolean }>`
  width: 52px;
  height: 30px;
  border-radius: 999px;
  background: ${props => props.$on ? '#2563eb' : '#e5e7eb'};
  border: none;
  position: relative;
  cursor: pointer;
`;

export const ToggleKnob = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 3px;
  left: ${props => props.$on ? '26px' : '3px'};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  transition: left 150ms ease;
`;