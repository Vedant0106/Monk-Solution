import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductComponent from './ProductComponent';
import '@testing-library/jest-dom';

// Mock the image import
jest.mock('./logo/monkCommerceLogo.png', () => 'mocked-logo.png');

// Mock the ProductListComponent to simulate selecting products
jest.mock('./ProductListComponent', () => ({ handlePopupClose, handleSelectedProducts }) => {
  return (
    <div data-testid="mock-product-list">
      <button
        onClick={() => {
          handleSelectedProducts([
            {
              title: 'T-Shirt',
              variants: [{ title: 'M / Red' }, { title: 'L / Blue' }],
            },
          ]);
          handlePopupClose();
        }}
      >
        Select Products
      </button>
    </div>
  );
});

describe('ProductComponent', () => {
  it('renders logo and heading', () => {
    render(<ProductComponent />);
    expect(screen.getByAltText('MonkLogo')).toBeInTheDocument();
    expect(screen.getByText(/Monk Upsell & Cross-sell/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Products/i)).toBeInTheDocument();
  });

  it('shows modal when Add Button is clicked', () => {
    render(<ProductComponent />);
    const addButton = screen.getByRole('button', { name: /Add Button/i });
    fireEvent.click(addButton);
    expect(screen.getByTestId('mock-product-list')).toBeInTheDocument();
  });

  it('displays selected products and their variants', async () => {
    render(<ProductComponent />);
    const addButton = screen.getByRole('button', { name: /Add Button/i });
    fireEvent.click(addButton);

    const selectButton = screen.getByRole('button', { name: /Select Products/i });
    fireEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('T-Shirt')).toBeInTheDocument();
      expect(screen.getByDisplayValue('M / Red')).toBeInTheDocument();
      expect(screen.getByDisplayValue('L / Blue')).toBeInTheDocument();
    });
  });

  it('displays "No products selected." when empty', () => {
    render(<ProductComponent />);
    expect(screen.getByText(/No products selected/i)).toBeInTheDocument();
  });
});
