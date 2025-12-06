"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Eye, Plus, Save, GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getContentByKeyAction, upsertContentAction } from "@/app/actions/admin/pages"

const FaqEditor = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const pageNames = {
    "faq-vendor": "FAQ - Vendors",
    "faq-customer": "FAQ - Customers",
  };

  useEffect(() => {
    loadContent();
  }, [slug]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const result = await getContentByKeyAction(slug);
      if (result.success && result.data) {
        setFaqs(result.data.content || []);
      } else {
        // Initialize with empty array if no content exists
        setFaqs([]);
      }
    } catch (error) {
      toast.error("Failed to load FAQs");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const handleUpdateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...faqs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFaqs(updated);
  };

  const handleMoveDown = (index) => {
    if (index === faqs.length - 1) return;
    const updated = [...faqs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setFaqs(updated);
  };

  const handleSave = async () => {
    // Validate
    const invalidFaqs = faqs.filter(
      (faq) => !faq.question.trim() || !faq.answer.trim()
    );
    if (invalidFaqs.length > 0) {
      toast.error("All questions and answers must be filled");
      return;
    }

    if (faqs.length === 0) {
      toast.error("Please add at least one FAQ");
      return;
    }

    setSaving(true);
    try {
      const result = await upsertContentAction(slug, {
        type: "faq",
        content: faqs,
      });

      if (result.success) {
        toast.success("FAQs saved successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save FAQs");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open("/faq", "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/content-moderation/content")}
            className="border rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="!text-2xl !tracking-wide !text-primary/80 font-bold">
              {pageNames[slug]}
            </h1>
            <p className="!text-sm text-gray-500">
              Manage frequently asked questions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleAddFaq} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    No FAQs yet
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click "Add Question" to create your first FAQ
                  </p>
                </div>
                <Button onClick={handleAddFaq} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Question
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq, index) => (
            <Card key={index} className="group hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-5 w-5 p-0"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground rotate-90" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === faqs.length - 1}
                      className="h-5 w-5 p-0"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground -rotate-90" />
                    </Button>
                  </div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Question {index + 1}
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFaq(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={faq.question}
                    onChange={(e) =>
                      handleUpdateFaq(index, "question", e.target.value)
                    }
                    placeholder="Enter your question here"
                    className="font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={faq.answer}
                    onChange={(e) =>
                      handleUpdateFaq(index, "answer", e.target.value)
                    }
                    placeholder="Enter the answer here"
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {faq.answer.length} characters
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add padding to bottom to prevent content hiding under sticky bar */}
      {faqs.length > 0 && <div className="h-20" />}
    </div>
  );
};

export default FaqEditor;