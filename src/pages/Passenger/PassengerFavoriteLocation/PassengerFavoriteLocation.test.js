import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PassengerFavoriteLocation from './PassengerFavoriteLocation';
import useFavorite from '../../../hooks/data/Favorite/useFavorite';
import useNeshanApi from '../../../hooks/data/useNeshanApi';
import { NotificationController } from '../../../lib/notificationController';

// Mocking the custom hooks
jest.mock('../../../hooks/data/Favorite/useFavorite');
jest.mock('../../../hooks/data/useNeshanApi');
jest.mock('../../../lib/notificationController');

describe('PassengerFavoriteLocation Component', () => {
    beforeEach(() => {
        useFavorite.mockReturnValue({
            result: null,
            type: '',
            refreshData: jest.fn(),
        });
        useNeshanApi.mockReturnValue({
            searchState: { inProgress: false },
        });
    });

    test('renders the component', () => {
        render(<PassengerFavoriteLocation />);
        expect(screen.getByText(/منتخب/i)).toBeInTheDocument();
    });

    test('opens the form when marker is clicked', () => {
        render(<PassengerFavoriteLocation />);
        const marker = screen.getByRole('button', { name: /check-icon/i });
        fireEvent.click(marker);
        expect(screen.getByPlaceholderText(/نام/i)).toBeInTheDocument();
    });

    test('handles adding a new favorite location', async () => {
        useFavorite.mockReturnValueOnce({
            result: { status: 200, data: [] },
            type: 'insert',
            refreshData: jest.fn(),
        });

        render(<PassengerFavoriteLocation />);

        const marker = screen.getByRole('button', { name: /check-icon/i });
        fireEvent.click(marker);

        fireEvent.change(screen.getByPlaceholderText(/نام/i), { target: { value: 'Test Location' } });
        fireEvent.change(screen.getByPlaceholderText(/جزییات برای مسیریابی بهتر/i), { target: { value: 'Test Description' } });

        fireEvent.click(screen.getByText(/ثبت/i));

        await waitFor(() => {
            expect(NotificationController.showSuccess).toHaveBeenCalledWith('مکان منتخب اضافه شد');
        });
    });

    test('handles editing an existing favorite location', async () => {
        useFavorite.mockReturnValueOnce({
            result: { status: 200, data: [{ name: 'Old Location', description: 'Old Description', location: { coordinates: [1, 2] } }] },
            type: 'update',
            refreshData: jest.fn(),
        });

        render(<PassengerFavoriteLocation />);

        fireEvent.click(screen.getByText('Old Location'));
        fireEvent.change(screen.getByPlaceholderText(/نام/i), { target: { value: 'Updated Location' } });
        fireEvent.change(screen.getByPlaceholderText(/جزییات برای مسیریابی بهتر/i), { target: { value: 'Updated Description' } });

        fireEvent.click(screen.getByText(/بروزرسانی/i));

        await waitFor(() => {
            expect(NotificationController.showSuccess).toHaveBeenCalledWith('مکان منتخب بروزرسانی شد');
        });
    });
});
