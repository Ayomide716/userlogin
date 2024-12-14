import { Unsubscribe } from 'firebase/firestore';

class SubscriptionManager {
  private subscriptions: Map<string, Unsubscribe> = new Map();

  addSubscription(id: string, unsubscribe: Unsubscribe) {
    // Clean up existing subscription before adding new one
    this.cleanupSubscription(id);
    this.subscriptions.set(id, unsubscribe);
  }

  cleanupSubscription(id: string) {
    const existing = this.subscriptions.get(id);
    if (existing) {
      existing();
      this.subscriptions.delete(id);
    }
  }

  cleanupAll() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  }
}

export const subscriptionManager = new SubscriptionManager();