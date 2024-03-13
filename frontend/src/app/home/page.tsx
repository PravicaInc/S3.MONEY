import { SelectStableCoinForm } from '@/Components/SelectStableCoinForm';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center w-full grow p-5">
      <SelectStableCoinForm className="w-[450px]" />
    </div>
  );
}
