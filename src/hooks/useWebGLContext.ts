import { useEffect, useRef } from 'react';

// Global WebGL context tracker
class WebGLContextManager {
  private static instance: WebGLContextManager;
  private contexts: Set<WebGLRenderingContext> = new Set();
  private maxContexts = 25; // Increased limit to allow all Tech balls + Hero + Earth

  private constructor() { }

  static getInstance(): WebGLContextManager {
    if (!WebGLContextManager.instance) {
      WebGLContextManager.instance = new WebGLContextManager();
    }
    return WebGLContextManager.instance;
  }

  register(context: WebGLRenderingContext): boolean {
    if (this.contexts.size >= this.maxContexts) {
      console.warn(`WebGL context limit reached (${this.maxContexts}). Consider reducing Canvas instances.`);
      return false;
    }
    this.contexts.add(context);
    // console.log(`WebGL context registered. Active contexts: ${this.contexts.size}/${this.maxContexts}`);
    return true;
  }

  unregister(context: WebGLRenderingContext): void {
    this.contexts.delete(context);
    // console.log(`WebGL context unregistered. Active contexts: ${this.contexts.size}/${this.maxContexts}`);
  }

  getActiveContextCount(): number {
    return this.contexts.size;
  }

  canCreateContext(): boolean {
    return this.contexts.size < this.maxContexts;
  }
}

export const useWebGLContext = () => {
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const manager = WebGLContextManager.getInstance();

  useEffect(() => {
    return () => {
      if (contextRef.current) {
        manager.unregister(contextRef.current);
      }
    };
  }, [manager]);

  return {
    contextRef,
    registerContext: (ctx: WebGLRenderingContext) => {
      if (manager.register(ctx)) {
        contextRef.current = ctx;
        return true;
      }
      return false;
    },
    canCreate: () => manager.canCreateContext(),
  };
};

export const canCreateContext = () => {
  return WebGLContextManager.getInstance().canCreateContext();
};

export const getActiveContextCount = () => {
  return WebGLContextManager.getInstance().getActiveContextCount();
};
