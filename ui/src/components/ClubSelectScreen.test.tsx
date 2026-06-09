import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { ALL_CLUBS } from '../data/clubs';
import { ClubSelectScreen } from './ClubSelectScreen';

afterEach(cleanup);

describe('ClubSelectScreen', () => {
  it('renders every club option', () => {
    render(<ClubSelectScreen selectedClub="driver" onSelect={vi.fn()} onSkip={vi.fn()} />);
    for (const club of ALL_CLUBS) {
      expect(screen.getByText(club.label)).toBeDefined();
    }
  });

  it('renders the category headings', () => {
    render(<ClubSelectScreen selectedClub="driver" onSelect={vi.fn()} onSkip={vi.fn()} />);
    expect(screen.getByText('Irons')).toBeDefined();
    expect(screen.getByText('Hybrids')).toBeDefined();
    expect(screen.getByText('Woods')).toBeDefined();
  });

  it('marks the selected club with the selected modifier class', () => {
    render(<ClubSelectScreen selectedClub="7-iron" onSelect={vi.fn()} onSkip={vi.fn()} />);
    const selectedButton = screen.getByText('7i');
    expect(selectedButton.className).toContain('club-select__option--selected');
  });

  it('renders a close (dismiss) button instead of a skip button', () => {
    render(<ClubSelectScreen selectedClub="driver" onSelect={vi.fn()} onSkip={vi.fn()} />);
    expect(screen.getByLabelText('Close club selection')).toBeDefined();
    expect(screen.queryByText('Skip')).toBeNull();
  });

  it('calls onSelect when a club is clicked', () => {
    const onSelectMock = vi.fn();
    render(<ClubSelectScreen selectedClub="driver" onSelect={onSelectMock} onSkip={vi.fn()} />);
    
    const ironButton = screen.getByText('7i');
    fireEvent.click(ironButton);
    
    expect(onSelectMock).toHaveBeenCalledWith('7-iron');
  });

  it('calls onSkip when the close button is clicked', () => {
    const onSkipMock = vi.fn();
    render(<ClubSelectScreen selectedClub="driver" onSelect={vi.fn()} onSkip={onSkipMock} />);
    
    const closeButton = screen.getByLabelText('Close club selection');
    fireEvent.click(closeButton);
    
    expect(onSkipMock).toHaveBeenCalled();
  });
});
