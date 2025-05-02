import React from 'react';
import { render, screen } from '@testing-library/react';
import CircularTimer from './HourglassTimer';

describe('HourglassTimer', () => {
    it('should render correctly with time and progress', async () => {
        const timeLeft = 30;
        const totalTime = 40;
        render(<CircularTimer timeLeft={timeLeft} totalTime={totalTime} />);
        
        const timerText = screen.getByText(`${timeLeft}s`);
        await expect(timerText).toBeInTheDocument();
    });

    it('should show warning color when time is low', async () => {
        const timeLeft = 7;
        const totalTime = 40;
        render(<CircularTimer timeLeft={timeLeft} totalTime={totalTime} />);
        
        const progressCircle = screen.getByRole('progressbar');
        await expect(progressCircle).toHaveStyle({
            color: 'gold'
        });
    });

    it('should show normal color when time is sufficient', async () => {
        const timeLeft = 30;
        const totalTime = 40;
        render(<CircularTimer timeLeft={timeLeft} totalTime={totalTime} />);
        
        const progressCircle = screen.getByRole('progressbar');
        await expect(progressCircle).toHaveStyle({
            color: 'green'
        });
    });

    it('should show danger color when time is critical', async () => {
        const timeLeft = 3;
        const totalTime = 40;
        render(<CircularTimer timeLeft={timeLeft} totalTime={totalTime} />);
        
        const progressCircle = screen.getByRole('progressbar');
        await expect(progressCircle).toHaveStyle({
            color: 'red'
        });
    });

    it('should calculate progress correctly', async () => {
        const timeLeft = 20;
        const totalTime = 40;
        render(<CircularTimer timeLeft={timeLeft} totalTime={totalTime} />);
        
        const progressCircle = screen.getByRole('progressbar');
        const expectedProgress = ((timeLeft / totalTime - 2)) * 100;
        await expect(progressCircle).toHaveAttribute('aria-valuenow', expectedProgress.toString());
    });
}); 