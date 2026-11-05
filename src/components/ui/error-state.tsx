type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-800"
    >
      <p className="font-medium">تعذر تحميل البيانات</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
