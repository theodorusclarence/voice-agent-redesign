import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Allow router mocks.
vi.mock('next/router', () => import('next-router-mock'));
