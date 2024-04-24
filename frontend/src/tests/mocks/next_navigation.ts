export const useSearchParams = jest.fn();

export const usePathname = jest.fn();

export const useRouter = jest.fn(() => ({
  replace: jest.fn(),
  push: jest.fn(),
}));

export const useParams = jest.fn();

export const useSelectedLayoutSegments = jest.fn();

export const useSelectedLayoutSegment = jest.fn();
