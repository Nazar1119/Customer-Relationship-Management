# ml/train.py
import joblib
from ml.ml import SimpleClassifier
from app.db.session import SessionLocal
from app.models.request import Request

MODEL_PATH = "ml/model.pkl"

def train_from_db():
    db = SessionLocal()
    try:
        # беремо всі заявки, де категорія вже задана
        rows = db.query(Request).filter(Request.category.isnot(None)).all()
        texts = [r.description for r in rows]
        labels = [r.category for r in rows]

        if not texts or not labels:
            # fallback: якщо немає даних у БД
            texts = [
                "screen cracked", "battery issue", "wifi not working",
                "data recovery needed", "system overheating"
            ]
            labels = ["hardware", "network", "data_recovery", "maintenance", "battery", "screen", "software"]

        clf = SimpleClassifier()
        clf.train(texts, labels)

        # збережемо модель у файл
        joblib.dump(clf, MODEL_PATH)
        return clf
    finally:
        db.close()

def load_model():
    try:
        return joblib.load(MODEL_PATH)
    except Exception:
        # якщо файл відсутній — тренуємо заново
        return train_from_db()

# глобальна змінна для імпорту у FastAPI
MODEL = load_model()
