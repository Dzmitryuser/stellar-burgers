import { OrderInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';
import { TIngredient, TOrder } from '@utils-types';

const meta = {
  title: 'Example/OrderInfo',
  component: OrderInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OrderInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockIngredients: TIngredient[] = [
  {
    _id: '211',
    name: 'Булка',
    type: 'bun',
    proteins: 12,
    fat: 23,
    carbohydrates: 45,
    calories: 56,
    price: 67,
    image: '',
    image_large: '',
    image_mobile: '',
    __v: 0
  },
  {
    _id: '212',
    name: 'Начинка',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 50,
    image: '',
    image_large: '',
    image_mobile: '',
    __v: 0
  }
];

const mockOrder: TOrder = {
  _id: '233',
  status: 'done',
  name: 'Order',
  createdAt: '2024-01-25T10:00:00.000Z',
  updatedAt: '2024-01-25T10:30:00.000Z',
  number: 2,
  ingredients: ['211', '212', '211'] // bun, filling, bun
};

export const DefaultOrderInfo: Story = {
  args: {
    orderData: mockOrder,
    ingredients: mockIngredients
  }
};
