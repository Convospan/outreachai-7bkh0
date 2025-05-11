// TODO: Implement Firebase sign-in UI
export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-xl drop-shadow-lg">
        <h1 className="text-2xl font-bold text-center text-card-foreground">Sign In to ConvoSpan AI</h1>
        <p className="text-center text-muted-foreground">
          Firebase authentication will be implemented here.
        </p>
        {/* Placeholder for Firebase sign-in form or buttons */}
        <div className="space-y-4">
           <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90">
            Sign In with Email (Placeholder)
          </button>
           <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Sign In with Google (Placeholder)
          </button>
        </div>
      </div>
    </div>
  );
}
